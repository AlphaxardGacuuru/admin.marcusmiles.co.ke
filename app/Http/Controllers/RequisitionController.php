<?php

namespace App\Http\Controllers;

use App\Http\Services\RequisitionService;
use App\Models\Requisition;
use Illuminate\Http\Request;

class RequisitionController extends Controller
{
    public function __construct(protected RequisitionService $service)
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
            "projectId" => "required|integer",
            "approvedBy" => "required|integer",
            "checkedBy" => "required|integer",
        ]);

        [$saved, $message, $requisition] = $this->service->store($request);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $requisition,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Requisition  $requisition
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
     * @param  \App\Models\Requisition  $requisition
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "approvedBy" => "nullable|integer",
            "checkedBy" => "nullable|integer",
        ]);

        [$saved, $message, $requisition] = $this->service->update($request, $id);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $requisition,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Requisition  $requisition
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $requisition] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $requisition,
        ], 200);
    }

    public function previewPdf($id)
    {
        [$pdf, $requisition] = $this->service->generatePdf($id);

        return $pdf->stream("Requisition-{$requisition->code}.pdf");
    }
}
