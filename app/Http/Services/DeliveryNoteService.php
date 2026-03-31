<?php

namespace App\Http\Services;

use App\Http\Resources\DeliveryNoteResource;
use App\Models\DeliveryNote;
use App\Models\DeliveryNoteInventory;
use App\Models\DeliveryNoteStage;
use App\Models\Inventory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Barryvdh\DomPDF\Facade\Pdf;

class DeliveryNoteService extends Service
{
    /*
     * Get All Delivery Notes
     */
    public function index($request)
    {
        $deliveryNotesQuery = new DeliveryNote;

        $deliveryNotesQuery = $this->search($deliveryNotesQuery, $request);

        $deliveryNotes = $deliveryNotesQuery
            ->paginate(20);

        return DeliveryNoteResource::collection($deliveryNotes);
    }

    /*
     * Get One DeliveryNote
     */
    public function show($id)
    {
        $deliveryNote = DeliveryNote::findOrFail($id);

        return new DeliveryNoteResource($deliveryNote);
    }

    /*
     * Store DeliveryNote
     */
    public function store($request)
    {
        $inventoryIds = $request->inventoryIds;

        $deliveryNoteNumber = DeliveryNote::count() + 1;
        $paddedDeliveryNoteNumber = str_pad($deliveryNoteNumber, 3, '0', STR_PAD_LEFT);

        $code = "D-" . $paddedDeliveryNoteNumber;

        // Get Inventory
        $inventory = Inventory::find($inventoryIds[0]);

        $deliveryNote = new DeliveryNote;
        $deliveryNote->code = $code;
        $deliveryNote->project_id = $inventory->project_id;
        $deliveryNote->received_by = $request->receivedBy;
        $deliveryNote->created_by = $this->id;

        $saved = DB::transaction(function () use ($deliveryNote, $inventoryIds) {
            $deliveryNote->save();

            foreach ($inventoryIds as $inventoryId) {
                // Check if DeliveryNoteInventory exists
                $deliveryNoteInventoryDoesntExist = DeliveryNoteInventory::where("inventory_id", $inventoryId)
                    ->doesntExist();

                if ($deliveryNoteInventoryDoesntExist) {
                    $deliveryNoteInventory = new DeliveryNoteInventory;
                    $deliveryNoteInventory->delivery_note_id = $deliveryNote->id;
                    $deliveryNoteInventory->inventory_id = $inventoryId;
                    $deliveryNoteInventory->created_by = $this->id;
                    $deliveryNoteInventory->save();
                } else {
                    return throw ValidationException::withMessages([
                        "Inventory" => ["Inventory already exists in Delivery Note"],
                    ]);
                }
            }

            return true;
        });

        $message = $deliveryNote->code . " created successfully";

        return [$saved, $message, $deliveryNote];
    }

    /*
     * Update DeliveryNote
     */
    public function update($request, $id)
    {
        $deliveryNote = DeliveryNote::find($id);

        if ($request->filled("name")) {
            $deliveryNote->name = $request->name;
        }

        if ($request->filled("receivedBy")) {
            $deliveryNote->received_by = $request->receivedBy;
        }

        $saved = $deliveryNote->save();

        $message = $deliveryNote->code . " updated successfully";

        return [$saved, $message, $deliveryNote];
    }

    /*
     * Delete DeliveryNote
     */
    public function destroy($id)
    {
        $deliveryNote = DeliveryNote::findOrFail($id);

        $deleted = $deliveryNote->delete();

        $message = $deliveryNote->code . " deleted successfully";

        return [$deleted, $message, $deliveryNote];
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

        if ($request->filled("receivedBy")) {
            $query = $query->where("received_by", $request->receivedBy);
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

        $serviceProviderId = $request->serviceProviderId;

        if ($request->filled("serviceProviderId")) {
            $query = $query->whereHas("serviceProviders", function ($query) use ($serviceProviderId) {
                $query->where("service_provider_id", $serviceProviderId);
            });
        }

        return $query;
    }

    /*
	 * Generate DeliveryNote PDF
	 */
    public function generatePdf($id)
    {
        $deliveryNote = DeliveryNote::findOrFail($id);

        // This looks for resources/views/delivery-notes/pdf.blade.php
        $pdf = Pdf::loadView('delivery-notes.pdf', compact('deliveryNote'));

        return $pdf;
    }
}
