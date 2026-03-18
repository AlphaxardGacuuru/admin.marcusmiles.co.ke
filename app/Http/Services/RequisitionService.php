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
