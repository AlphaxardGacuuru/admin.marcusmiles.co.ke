<?php

namespace App\Http\Services;

use App\Http\Resources\InventoryResource;
use App\Models\Inventory;
use App\Models\InventoryQuantity;
use Carbon\Carbon;

class InventoryService extends Service
{
    /*
     * Get All Inventories
     */
    public function index($request)
    {
        $inventoriesQuery = new Inventory;

        $inventoriesQuery = $this->search($inventoriesQuery, $request);

        $inventories = $inventoriesQuery
            ->paginate(20);

        return InventoryResource::collection($inventories);
    }

    /*
     * Get One Inventory
     */
    public function show($id)
    {
        $inventory = Inventory::findOrFail($id);

        return new InventoryResource($inventory);
    }

    /*
     * Store Inventory
     */
    public function store($request)
    {
        $inventory = new Inventory;
        $inventory->project_id = $request->projectId;
        $inventory->good_id = $request->goodId;
        $inventory->unit = $request->unit;
        $inventory->quantity = $request->quantity;
        $inventory->supplier_id = $request->supplierId;
        $inventory->created_by = $this->id;
        $saved = $inventory->save();

        $message = "Inventory created successfully";

        return [$saved, $message, $inventory];
    }

    /*
     * Update Inventory
     */
    public function update($request, $id)
    {
        $inventory = Inventory::find($id);

        if ($request->filled("name")) {
            $inventory->name = $request->name;
        }

        if ($request->filled("quantity")) {
            $inventory->quantity = $request->quantity;
        }

        if ($request->filled("unit")) {
            $inventory->unit = $request->unit;
        }

        if ($request->filled("reduce")) {
            $inventoryQuantity = new InventoryQuantity;
            $inventoryQuantity->inventory_id = $inventory->id;
            $inventoryQuantity->quantity = $request->quantity;
            $inventoryQuantity->created_by = $this->id;
            $inventoryQuantity->save();
        }

        $inventory->supplier_id = $request->supplierId;

        $saved = $inventory->save();

        $message = $inventory->good->code . " updated successfully";

        return [$saved, $message, $inventory];
    }

    /*
     * Delete Inventory
     */
    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);

        $deleted = $inventory->delete();

        $message = $inventory->name . " deleted successfully";

        return [$deleted, $message, $inventory];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        if ($request->filled("goodId")) {
            $query = $query->where("good_id", $request->goodId);
        }

        if ($request->filled("projectId")) {
            $query = $query->where("project_id", $request->projectId);
        }

        if ($request->filled("supplierId")) {
            $query = $query->where("supplier_id", $request->supplierId);
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
