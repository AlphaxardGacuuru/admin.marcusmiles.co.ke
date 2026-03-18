<?php

namespace App\Http\Services;

use App\Http\Resources\RequisitionResource;
use App\Models\Requisition;
use Carbon\Carbon;

class RequisitionService extends Service
{
    /*
     * Get All Requisitions
     */
    public function index($request)
    {
        $requisitionQuery = new Requisition;

        $requisitionQuery = $this->search($requisitionQuery, $request);

        $requisitions = $requisitionQuery
            ->paginate(20);

        return RequisitionResource::collection($requisitions);
    }

    /*
     * Get One Requisition
     */
    public function show($id)
    {
        $requisition = Requisition::findOrFail($id);

        return new RequisitionResource($requisition);
    }

    /*
     * Store Requisition
     */
    public function store($request)
    {
        $requisitionNumber = Requisition::count() + 1;
        $paddedRequisitionNumber = str_pad($requisitionNumber, 3, '0', STR_PAD_LEFT);

        $code = "R-" . $paddedRequisitionNumber;

        $requisition = new Requisition;
        $requisition->code = $code;
        $requisition->project_id = $request->projectId;
        $requisition->approved_by = $request->approvedBy;
        $requisition->checked_by = $request->checkedBy;
        $requisition->paid_by = $request->paidBy;
        $requisition->created_by = $this->id;
        $saved = $requisition->save();

        $message = $requisition->code . " created successfully";

        return [$saved, $message, $requisition];
    }

    /*
     * Update Requisition
     */
    public function update($request, $id)
    {
        $requisition = Requisition::find($id);

        if ($request->filled("approvedBy")) {
            $requisition->approved_by = $request->approvedBy;
        }

        if ($request->filled("checkedBy")) {
            $requisition->checked_by = $request->checkedBy;
        }

        if ($request->filled("paidBy")) {
            $requisition->paid_by = $request->paidBy;
        }

        $saved = $requisition->save();

        $message = $requisition->code . " updated successfully";

        return [$saved, $message, $requisition];
    }

    /*
     * Delete Requisition
     */
    public function destroy($id)
    {
        $requisition = Requisition::findOrFail($id);

        $deleted = $requisition->delete();

        $message = $requisition->code . " deleted successfully";

        return [$deleted, $message, $requisition];
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

        if ($request->filled("checkedBy")) {
            $query = $query->where("checked_by", $request->checkedBy);
        }

        if ($request->filled("paidBy")) {
            $query = $query->where("paid_by", $request->paidBy);
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
            $query = $query->where("issue_date", ">=", $startDate);
        }

        // Build end date filter
        if ($request->filled("endMonth") || $request->filled("endYear")) {
            $year = $endYear ?? date('Y');
            $month = $endMonth ?? 12;
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();
            $query = $query->where("issue_date", "<=", $endDate);
        }

        return $query;
    }
}
