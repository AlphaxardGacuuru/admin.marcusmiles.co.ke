<?php

namespace App\Http\Controllers;

use App\Http\Services\SiteVisitReportService;
use App\Models\SiteVisitReport;
use Illuminate\Http\Request;

class SiteVisitReportController extends Controller
{
    public function __construct(protected SiteVisitReportService $service)
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
        ]);

        [$saved, $message, $siteVisitReport] = $this->service->store($request);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $siteVisitReport,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SiteVisitReport  $siteVisitReport
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
     * @param  \App\Models\SiteVisitReport  $siteVisitReport
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "approvedBy" => "nullable|integer",
        ]);

        [$saved, $message, $siteVisitReport] = $this->service->update($request, $id);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $siteVisitReport,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SiteVisitReport  $siteVisitReport
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $siteVisitReport] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $siteVisitReport,
        ], 200);
    }

    public function previewPdf($id)
    {
        [$pdf, $siteVisitReport] = $this->service->generatePdf($id);

        return $pdf->stream("SiteVisitReport-{$siteVisitReport->code}.pdf");
    }
}
