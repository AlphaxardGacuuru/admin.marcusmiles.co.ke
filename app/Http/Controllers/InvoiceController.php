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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'projectId' => 'required|exists:projects,id',
            'total' => 'required|numeric',
            'issueDate' => 'required|date',
            'dueDate' => 'required|date',
            'notes' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:500',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
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
        [$status, $message, $invoice] = $this->service->show($id);

        return (new InvoiceResource($invoice))->additional([
            "status" => $status,
            "message" => $message
        ]);
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
        $this->validate($request, [
            'projectId' => 'sometimes|exists:projects,id',
            'total' => 'sometimes|numeric',
            'issueDate' => 'sometimes|date',
            'dueDate' => 'sometimes|date',
            'notes' => 'sometimes|string',
            'items' => 'sometimes|array|min:1',
            'items.*.description' => 'sometimes|string|max:500',
            'items.*.quantity' => 'sometimes|numeric|min:0.01',
            'items.*.rate' => 'sometimes|numeric|min:0',
            'items.*.total' => 'sometimes|numeric|min:0',
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

        return (new InvoiceResource($invoice))->additional([
            "status" => $deleted,
            "message" => $message,
            "data" => $invoice,
        ]);
    }
}
