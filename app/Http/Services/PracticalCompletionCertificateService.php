<?php

namespace App\Http\Services;

use App\Http\Resources\PracticalCompletionCertificateResource;
use App\Models\PracticalCompletionCertificate;
use Carbon\Carbon;

class PracticalCompletionCertificateService extends Service
{
    /*
     * Get All Practical Completion Certificates
     */
    public function index($request)
    {
        $practicalCompletionCertificateQuery = new PracticalCompletionCertificate;

        $practicalCompletionCertificateQuery = $this->search($practicalCompletionCertificateQuery, $request);

        $practicalCompletionCertificates = $practicalCompletionCertificateQuery
            ->paginate(20);

        return PracticalCompletionCertificateResource::collection($practicalCompletionCertificates);
    }

    /*
     * Get One PracticalCompletionCertificate
     */
    public function show($id)
    {
        $practicalCompletionCertificate = PracticalCompletionCertificate::findOrFail($id);

        return new PracticalCompletionCertificateResource($practicalCompletionCertificate);
    }

    /*
     * Store PracticalCompletionCertificate
     */
    public function store($request)
    {
        $practicalCompletionCertificateNumber = PracticalCompletionCertificate::count() + 1;
        $paddedPracticalCompletionCertificateNumber = str_pad($practicalCompletionCertificateNumber, 3, '0', STR_PAD_LEFT);

        $code = "PCC-" . $paddedPracticalCompletionCertificateNumber;

        $practicalCompletionCertificate = new PracticalCompletionCertificate;
        $practicalCompletionCertificate->code = $code;
        $practicalCompletionCertificate->project_id = $request->projectId;
        $practicalCompletionCertificate->employer = $request->employer;
        $practicalCompletionCertificate->contractor = $request->contractor;
        $practicalCompletionCertificate->project_manager = $request->projectManager;
        $practicalCompletionCertificate->brief = $request->brief;
        $practicalCompletionCertificate->contract_dates = $request->contractDates;
        $practicalCompletionCertificate->created_by = $this->id;
        $saved = $practicalCompletionCertificate->save();

        $message = $practicalCompletionCertificate->code . " created successfully";

        return [$saved, $message, $practicalCompletionCertificate];
    }

    /*
     * Update PracticalCompletionCertificate
     */
    public function update($request, $id)
    {
        $practicalCompletionCertificate = PracticalCompletionCertificate::find($id);

        if ($request->filled("employer")) {
            $practicalCompletionCertificate->employer = $request->employer;
        }

        if ($request->filled("contractor")) {
            $practicalCompletionCertificate->contractor = $request->contractor;
        }

        if ($request->filled("projectManager")) {
            $practicalCompletionCertificate->project_manager = $request->projectManager;
        }

        if ($request->filled("brief")) {
            $practicalCompletionCertificate->brief = $request->brief;
        }

        if ($request->filled("contractDates")) {
            $practicalCompletionCertificate->contract_dates = $request->contractDates;
        }

        $saved = $practicalCompletionCertificate->save();

        $message = $practicalCompletionCertificate->code . " updated successfully";

        return [$saved, $message, $practicalCompletionCertificate];
    }

    /*
     * Delete PracticalCompletionCertificate
     */
    public function destroy($id)
    {
        $practicalCompletionCertificate = PracticalCompletionCertificate::findOrFail($id);

        $deleted = $practicalCompletionCertificate->delete();

        $message = $practicalCompletionCertificate->code . " deleted successfully";

        return [$deleted, $message, $practicalCompletionCertificate];
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
