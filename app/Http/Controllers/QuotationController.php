<?php

namespace App\Http\Controllers;

use App\Http\Resources\InvoiceResource;
use App\Http\Resources\QuotationResource;
use App\Http\Services\QuotationService;
use App\Models\Quotation;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    public function __construct(protected QuotationService $service)
    {
        //
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        [$status, $message, $quotations, $statuses] = $this->service->index($request);

        return QuotationResource::collection($quotations)
            ->additional([
                "status" => $status,
                "message" => $message,
                "statuses" => $statuses
            ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'projectId' => 'required|exists:projects,id',
            'total' => 'required|numeric',
            'tax' => 'required|numeric|min:0',
            'issueDate' => 'required|date',
            'expiryDate' => 'required|date',
            'notes' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:500',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);

        [$saved, $message, $quotation] = $this->service->store($request);

        return (new QuotationResource($quotation))->additional([
            'status' => $saved,
            'message' => $message,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        [$status, $message, $quotation] = $this->service->show($id);

        return (new QuotationResource($quotation))->additional([
            "status" => $status,
            "message" => $message
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'projectId' => 'sometimes|exists:projects,id',
            'total' => 'sometimes|numeric',
            'tax' => 'sometimes|numeric|min:0',
            'issueDate' => 'sometimes|date',
            'expiryDate' => 'sometimes|date',
            'notes' => 'sometimes|string',
            'items' => 'sometimes|array|min:1',
            'items.*.description' => 'sometimes|string|max:500',
            'items.*.quantity' => 'sometimes|numeric|min:0.01',
            'items.*.rate' => 'sometimes|numeric|min:0',
            'items.*.total' => 'sometimes|numeric|min:0',
        ]);

        [$saved, $message, $quotation] = $this->service->update($request, $id);

        return (new QuotationResource($quotation))->additional([
            'status' => $saved,
            'message' => $message,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $quotation] = $this->service->destroy($id);

        return (new QuotationResource($quotation))->additional([
            'status' => $deleted,
            'message' => $message,
        ]);
    }

    /**
     * Generate an invoice from a quotation.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function generateInvoice($id)
    {
        [$saved, $message, $invoice] = $this->service->generateInvoice($id);

        return (new InvoiceResource($invoice))->additional([
            'status' => $saved,
            'message' => $message,
        ]);
    }
}
