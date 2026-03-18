<?php

namespace App\Http\Services;

use App\Http\Resources\SiteVisitReportResource;
use App\Models\SiteVisitReport;
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
        if ($request->filled("name")) {
            $query = $query
                ->where("name", "LIKE", "%" . $request->name . "%")
                ->orWhere("code", "LIKE", "%" . $request->name . "%");
        }

        if ($request->filled("type")) {
            $query = $query
                ->where("type", $request->type);
        }

        if ($request->filled("location")) {
            $query = $query
                ->where("location", "LIKE", "%" . $request->location . "%");
        }

        $clientId = $request->clientId;

        if ($request->filled("clientId")) {
            $query = $query->whereHas("client", function ($query) use ($clientId) {
                $query->where("id", $clientId);
            });
        }

        $projectServiceProviderId = $request->projectServiceProviderId;

        if ($request->filled("projectServiceProviderId")) {
            $query = $query->whereHas("project_service_providers", function ($query) use ($projectServiceProviderId) {
                $query->where("project_service_provider_id", $projectServiceProviderId);
            });
        }

        if ($request->filled("createdBy")) {
            $query = $query->where("created_by", $request->createdBy);
        }

        $startMonth = $request->filled("startMonth") ? $request->input("startMonth") : Carbon::now()->month;
        $endMonth = $request->filled("endMonth") ? $request->input("endMonth") : Carbon::now()->month;
        $startYear = $request->filled("startYear") ? $request->input("startYear") : Carbon::now()->year;
        $endYear = $request->filled("endYear") ? $request->input("endYear") : Carbon::now()->year;

        $start = Carbon::createFromDate($startYear, $startMonth, 1)
            ->startOfMonth()
            ->toDateTimeString(); // Output: 2024-01-01 00:00:00 (or current year)

        $end = Carbon::createFromDate($endYear, $endMonth, 1)
            ->endOfMonth()
            ->toDateTimeString(); // Output: 2024-01-01 00:00:00 (or current year)

        if ($request->filled("startMonth") || $request->filled("startYear")) {
            $query = $query->whereDate("created_at", ">=", $start);
        }

        if ($request->filled("endMonth") || $request->filled("endYear")) {
            $query = $query->whereDate("created_at", "<=", $end);
        }

        return $query;
    }
}
