<?php

namespace App\Http\Services;

use App\Http\Resources\StatusReportResource;
use App\Models\StatusReport;
use App\Models\StatusReportServiceProvider;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatusReportService extends Service
{
    /*
     * Get All Status Reports
     */
    public function index($request)
    {
        $statusReportsQuery = new StatusReport;

        $statusReportsQuery = $this->search($statusReportsQuery, $request);

        $statusReports = $statusReportsQuery
            ->paginate(20);

        return StatusReportResource::collection($statusReports);
    }

    /*
     * Get One StatusReport
     */
    public function show($id)
    {
        $statusReport = StatusReport::findOrFail($id);

        return new StatusReportResource($statusReport);
    }

    /*
     * Store StatusReport
     */
    public function store($request)
    {
        $statusReportNumber = StatusReport::count() + 1;
        $paddedStatusReportNumber = str_pad($statusReportNumber, 3, '0', STR_PAD_LEFT);

        $code = "SR-" . $paddedStatusReportNumber;

        $statusReport = new StatusReport;
        $statusReport->code = $code;
        $statusReport->project_id = $request->projectId;
        $statusReport->approved_by = $request->approvedBy;
        $statusReport->action_items = $request->actionItems;
        $statusReport->created_by = $this->id;
        $saved = $statusReport->save();

        $message = $statusReport->code . " created successfully";

        return [$saved, $message, $statusReport];
    }

    /*
     * Update StatusReport
     */
    public function update($request, $id)
    {
        $statusReport = StatusReport::find($id);

        if ($request->filled("approvedBy")) {
            $statusReport->approved_by = $request->approvedBy;
        }

        if ($request->filled("actionItems")) {
            $statusReport->action_items = $request->actionItems;
        }

        $saved = $statusReport->save();

        $message = $statusReport->code . " updated successfully";

        return [$saved, $message, $statusReport];
    }

    /*
     * Delete StatusReport
     */
    public function destroy($id)
    {
        $statusReport = StatusReport::findOrFail($id);

        $deleted = $statusReport->delete();

        $message = $statusReport->code . " deleted successfully";

        return [$deleted, $message, $statusReport];
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
