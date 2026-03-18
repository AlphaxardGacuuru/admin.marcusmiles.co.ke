<?php

namespace App\Http\Services;

use App\Http\Resources\WageSheetResource;
use App\Models\WageSheet;
use App\Models\WageSheetServiceProvider;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WageSheetService extends Service
{
    /*
     * Get All Wage Sheets
     */
    public function index($request)
    {
        $wageSheetsQuery = new WageSheet;

        $wageSheetsQuery = $this->search($wageSheetsQuery, $request);

        $wageSheets = $wageSheetsQuery
            ->paginate(20);

        return WageSheetResource::collection($wageSheets);
    }

    /*
     * Get One WageSheet
     */
    public function show($id)
    {
        $wageSheet = WageSheet::findOrFail($id);

        return new WageSheetResource($wageSheet);
    }

    /*
     * Store WageSheet
     */
    public function store($request)
    {
        $projectServiceProviderIds = $request->projectServiceProviderIds;

        $wageSheetNumber = WageSheet::count() + 1;
        $paddedWageSheetNumber = str_pad($wageSheetNumber, 3, '0', STR_PAD_LEFT);

        $code = "WS-" . $paddedWageSheetNumber;

        $wageSheet = new WageSheet;
        $wageSheet->code = $code;
        $wageSheet->project_id = $request->projectId;
        $wageSheet->created_by = $this->id;
        $wageSheet->paid_by = $request->paidBy;
        $wageSheet->approved_by = $request->approvedBy;
        $wageSheet->starts_at = $request->startsAt;
        $wageSheet->ends_at = $request->endsAt;

        $saved = DB::transaction(function () use ($wageSheet, $projectServiceProviderIds) {
            $wageSheet->save();

            foreach ($projectServiceProviderIds as $projectServiceProviderId) {
                // Check if WageSheetServiceProvider exists
                $wageSheetServiceProviderDoesntExist = WageSheetServiceProvider::where("wage_sheet_id", $wageSheet->id)
                    ->where("project_service_provider_id", $projectServiceProviderId["id"])
                    ->doesntExist();

                if ($wageSheetServiceProviderDoesntExist) {
                    $wageSheetServiceProvider = new WageSheetServiceProvider;
                    $wageSheetServiceProvider->wage_sheet_id = $wageSheet->id;
                    $wageSheetServiceProvider->project_service_provider_id = $projectServiceProviderId["id"];
                    $wageSheetServiceProvider->days = $projectServiceProviderId["days"];
                    $wageSheetServiceProvider->created_by = $this->id;
                    $wageSheetServiceProvider->save();
                } else {
                    return throw ValidationException::withMessages([
                        "Service Provider" => ["Service Provider already exists in Wage Sheet"],
                    ]);
                }
            }

            return true;
        });

        $message = $wageSheet->code . " created successfully";

        return [$saved, $message, $wageSheet];
    }

    /*
     * Update WageSheet
     */
    public function update($request, $id)
    {
        $projectServiceProviderIds = $request->projectServiceProviderIds;

        $wageSheet = WageSheet::find($id);

        if ($request->filled("paidBy")) {
            $wageSheet->paid_by = $request->paidBy;
        }

        if ($request->filled("approvedBy")) {
            $wageSheet->approved_by = $request->approvedBy;
        }

        if ($request->filled("startsAt")) {
            $wageSheet->starts_at = $request->startsAt;
        }

        if ($request->filled("endsAt")) {
            $wageSheet->ends_at = $request->endsAt;
        }

        $saved = DB::transaction(function () use ($wageSheet, $projectServiceProviderIds) {
            $wageSheet->save();

            foreach ($projectServiceProviderIds as $projectServiceProviderId) {
                // Check if WageSheetServiceProvider exists
                $wageSheetServiceProviderDoesntExist = WageSheetServiceProvider::where("wage_sheet_id", $wageSheet->id)
                    ->where("project_service_provider_id", $projectServiceProviderId["id"])
                    ->doesntExist();

                if ($wageSheetServiceProviderDoesntExist) {
                    $wageSheetServiceProvider = new WageSheetServiceProvider;
                    $wageSheetServiceProvider->wage_sheet_id = $wageSheet->id;
                    $wageSheetServiceProvider->project_service_provider_id = $projectServiceProviderId["id"];
                    $wageSheetServiceProvider->days = $projectServiceProviderId["days"];
                    $wageSheetServiceProvider->created_by = $this->id;
                    $wageSheetServiceProvider->save();
                } else {
                    $wageSheetServiceProvider = WageSheetServiceProvider::where("wage_sheet_id", $wageSheet->id)
                        ->where("project_service_provider_id", $projectServiceProviderId["id"])
                        ->first();
                    $wageSheetServiceProvider->wage_sheet_id = $wageSheet->id;
                    $wageSheetServiceProvider->project_service_provider_id = $projectServiceProviderId["id"];
                    $wageSheetServiceProvider->days = $projectServiceProviderId["days"];
                    $wageSheetServiceProvider->save();
                }

                $projectServiceProviderIdArray = collect($projectServiceProviderIds)
                    ->map(fn($projectServiceProviderId) => $projectServiceProviderId["id"]);

                // Delete Missing ids
                $wageSheetServiceProvider = WageSheetServiceProvider::where("wage_sheet_id", $wageSheet->id)
                    ->whereNotIn("project_service_provider_id", $projectServiceProviderIdArray)
                    ->delete();
            }

            return true;
        });

        $saved = $wageSheet->save();

        $message = $wageSheet->code . " updated successfully";

        return [$saved, $message, $wageSheet];
    }

    /*
     * Delete WageSheet
     */
    public function destroy($id)
    {
        $wageSheet = WageSheet::findOrFail($id);

        $deleted = $wageSheet->delete();

        $message = $wageSheet->code . " deleted successfully";

        return [$deleted, $message, $wageSheet];
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
            $query = $query->whereHas("client", function ($query) use ($clientId) {
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
}
