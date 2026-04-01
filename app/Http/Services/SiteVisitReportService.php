<?php

namespace App\Http\Services;

use App\Http\Resources\SiteVisitReportResource;
use App\Models\SiteVisitReport;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class SiteVisitReportService extends Service
{
    /*
     * Get All Site Visit Reports
     */
    public function index($request)
    {
        $siteVisitReportQuery = new SiteVisitReport;

        $siteVisitReportQuery = $this->search($siteVisitReportQuery, $request);

        $siteVisitReports = $siteVisitReportQuery
            ->paginate(20);

        return SiteVisitReportResource::collection($siteVisitReports);
    }

    /*
     * Get One SiteVisitReport
     */
    public function show($id)
    {
        $siteVisitReport = SiteVisitReport::findOrFail($id);

        return new SiteVisitReportResource($siteVisitReport);
    }

    /*
     * Store SiteVisitReport
     */
    public function store($request)
    {
        $siteVisitReportNumber = SiteVisitReport::count() + 1;
        $paddedSiteVisitReportNumber = str_pad($siteVisitReportNumber, 3, '0', STR_PAD_LEFT);

        $code = "SV-" . $paddedSiteVisitReportNumber;

        $siteVisitReport = new SiteVisitReport;
        $siteVisitReport->code = $code;
        $siteVisitReport->project_id = $request->projectId;
        $siteVisitReport->approved_by = $request->approvedBy;
        $siteVisitReport->created_by = $this->id;
        $saved = $siteVisitReport->save();

        $message = $siteVisitReport->code . " created successfully";

        return [$saved, $message, $siteVisitReport];
    }

    /*
     * Update SiteVisitReport
     */
    public function update($request, $id)
    {
        $siteVisitReport = SiteVisitReport::find($id);

        if ($request->filled("approvedBy")) {
            $siteVisitReport->approved_by = $request->approvedBy;
        }

        $saved = $siteVisitReport->save();

        $message = $siteVisitReport->code . " updated successfully";

        return [$saved, $message, $siteVisitReport];
    }

    /*
     * Delete SiteVisitReport
     */
    public function destroy($id)
    {
        $siteVisitReport = SiteVisitReport::findOrFail($id);

        $deleted = $siteVisitReport->delete();

        $message = $siteVisitReport->code . " deleted successfully";

        return [$deleted, $message, $siteVisitReport];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        if ($request->filled("code")) {
            $query = $query->where("code", "LIKE", "%" . $request->code . "%");
        }

        $clientId = $request->clientId;

        if ($request->filled("clientId")) {
            $query = $query->whereHas("project.client", function ($query) use ($clientId) {
                $query->where("id", $clientId);
            });
        }

        $projectId = $request->projectId;

        if ($request->filled("projectId")) {
            $query = $query->where("project_id", $projectId);
        }

        $projectServiceProviderId = $request->projectServiceProviderId;

        if ($request->filled("projectServiceProviderId")) {
            $query = $query->whereHas("project_service_providers", function ($query) use ($projectServiceProviderId) {
                $query->where("project_service_provider_id", $projectServiceProviderId);
            });
        }

        if ($request->filled("approvedBy")) {
            $query = $query->where("approved_by", $request->approvedBy);
        }

        if ($request->filled("createdBy")) {
            $query = $query->where("created_by", $request->createdBy);
        }

        $startMonth = $request->input("startMonth");
        $endMonth = $request->input("endMonth");
        $startYear = $request->input("startYear");
        $endYear = $request->input("endYear");

        // Build start date filter
        if ($request->filled("startMonth") || $request->filled("startYear")) {
            $year = $startYear ?? date('Y');
            $month = $startMonth ?? 1;
            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $query = $query->where("created_at", ">=", $startDate);
        }

        // Build end date filter
        if ($request->filled("endMonth") || $request->filled("endYear")) {
            $year = $endYear ?? date('Y');
            $month = $endMonth ?? 12;
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();
            $query = $query->where("created_at", "<=", $endDate);
        }

        return $query;
    }

    /*
     * Generate SiteVisitReport PDF
     */
    public function generatePdf($id)
    {
        $siteVisitReport = SiteVisitReport::findOrFail($id);

        $pdf = Pdf::loadView('site-visit-reports.pdf', compact('siteVisitReport'));

        return [$pdf, $siteVisitReport];
    }
}
