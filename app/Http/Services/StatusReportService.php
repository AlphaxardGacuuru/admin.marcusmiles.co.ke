<?php

namespace App\Http\Services;

use App\Http\Resources\StatusReportResource;
use App\Models\StatusReport;
use App\Models\StatusReportServiceProvider;
use Barryvdh\DomPDF\Facade\Pdf;
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
     * Generate StatusReport PDF
     */
    public function generatePdf($id)
    {
        $statusReport = StatusReport::findOrFail($id);

        $pdf = Pdf::loadView('status-reports.pdf', compact('statusReport'));

        return [$pdf, $statusReport];
    }
}
