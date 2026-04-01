<?php

namespace App\Http\Controllers;

use App\Http\Services\StatusReportService;
use App\Models\StatusReport;
use Illuminate\Http\Request;

class StatusReportController extends Controller
{
    public function __construct(protected StatusReportService $service)
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
            "actionItems" => "required|array",
        ]);

        [$saved, $message, $statusReport] = $this->service->store($request);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $statusReport,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\StatusReport  $statusReport
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
     * @param  \App\Models\StatusReport  $statusReport
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "approvedBy" => "nullable|integer",
            "actionItems" => "nullable|array",
        ]);

        [$saved, $message, $statusReport] = $this->service->update($request, $id);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $statusReport,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\StatusReport  $statusReport
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $statusReport] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $statusReport,
        ], 200);
    }

    public function previewPdf($id)
    {
        [$pdf, $statusReport] = $this->service->generatePdf($id);

        return $pdf->stream("StatusReport-{$statusReport->code}.pdf");
    }
}
