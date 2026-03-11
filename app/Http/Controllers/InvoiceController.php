<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Http\Resources\InvoiceResource;
use App\Http\Services\InvoiceService;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(protected InvoiceService $service) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        [$invoices, $sum, $balance, $paid, $statuses] = $this->service->index($request);

        return InvoiceResource::collection($invoices)
            ->additional([
                "sum" => number_format($sum),
                "balance" => number_format($balance),
                "paid" => number_format($paid),
                "statuses" => $statuses,
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'clientId' => 'required|integer|exists:users,id',
            'issueDate' => 'required|date',
            'dueDate' => 'required|date|after_or_equal:issueDate',
            'invoiceItems' => 'required|array|min:1',
            'invoiceItems.*.description' => 'required|string|max:500',
            'invoiceItems.*.quantity' => 'required|numeric|min:0.01',
            'invoiceItems.*.rate' => 'required|numeric|min:0',
            'invoiceItems.*.amount' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'terms' => 'nullable|string|max:1000',
            'status' => 'required|in:not_paid,partially_paid,paid,over_paid',
        ]);

        [$saved, $message, $invoice] = $this->service->store($request);

        return (new InvoiceResource($invoice))->additional([
            'saved' => $saved,
            'message' => $message,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $invoice = $this->service->show($id);

        return new InvoiceResource($invoice);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'clientId' => 'sometimes|required|integer|exists:users,id',
            'issueDate' => 'sometimes|required|date',
            'dueDate' => 'sometimes|required|date|after_or_equal:issueDate',
            'invoiceItems' => 'sometimes|required|array|min:1',
            'invoiceItems.*.description' => 'required_with:invoiceItems|string|max:500',
            'invoiceItems.*.quantity' => 'required_with:invoiceItems|numeric|min:0.01',
            'invoiceItems.*.rate' => 'required_with:invoiceItems|numeric|min:0',
            'invoiceItems.*.amount' => 'required_with:invoiceItems|numeric|min:0',
            'total' => 'sometimes|required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'terms' => 'nullable|string|max:1000',
            'status' => 'sometimes|required|in:not_paid,partially_paid,paid,over_paid',
        ]);

        [$updated, $message, $invoice] = $this->service->update($request, $id);

        return (new InvoiceResource($invoice))->additional([
            'updated' => $updated,
            'message' => $message,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        [$deleted, $message, $invoice] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $invoice,
        ], 200);
    }

    public function previewPdf($id)
    {
        $pdf = $this->service->generatePdf($id);

        return $pdf->stream("invoice-{$id}-preview.pdf");
    }

    /**
     * Send invoice email with PDF attachment
     */
    public function sendInvoiceEmail($id)
    {
        $this->service->sendInvoiceEmail($id);

        return response()->json(['message' => 'Invoice Email Sent.']);
    }
}
