<?php

namespace App\Http\Services;

use App\Http\Resources\PracticalCompletionCertificateResource;
use App\Models\PracticalCompletionCertificate;
use Barryvdh\DomPDF\Facade\Pdf;
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
        if ($request->filled("code")) {
            $query = $query
                ->where("code", "LIKE", "%" . $request->code . "%");
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
     * Generate PracticalCompletionCertificate PDF
     */
    public function generatePdf($id)
    {
        $practicalCompletionCertificate = PracticalCompletionCertificate::findOrFail($id);

        $pdf = Pdf::loadView('practical-completion-certificates.pdf', compact('practicalCompletionCertificate'));

        return [$pdf, $practicalCompletionCertificate];
    }
}
