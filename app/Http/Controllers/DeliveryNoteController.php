<?php

namespace App\Http\Controllers;

use App\Http\Services\DeliveryNoteService;
use App\Models\DeliveryNote;
use Illuminate\Http\Request;

class DeliveryNoteController extends Controller
{
    public function __construct(protected DeliveryNoteService $service)
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
        return $this->service->index($request);
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
            "inventoryIds" => "required|array|min:1",
            "inventoryIds.*" => "required|exists:inventories,id",
            "receivedBy" => "required|exists:users,id",
        ]);

        [$saved, $message, $deliveryNote] = $this->service->store($request);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $deliveryNote,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\DeliveryNote  $deliveryNote
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->service->show($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\DeliveryNote  $deliveryNote
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "name" => "nullable|string",
            "type" => "nullable|string",
            "description" => "nullable|string|max:255",
            "location" => "nullable|string",
            "clientId" => "nullable|string",
        ]);

        [$saved, $message, $deliveryNote] = $this->service->update($request, $id);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $deliveryNote,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\DeliveryNote  $deliveryNote
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $deliveryNote] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $deliveryNote,
        ], 200);
    }

    public function previewPdf($id)
    {
        [$pdf, $deliveryNote] = $this->service->generatePdf($id);

        return $pdf->stream("DeliveryNote-{$deliveryNote->code}.pdf");
    }
}
