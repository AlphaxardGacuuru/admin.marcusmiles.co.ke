<?php

namespace App\Http\Services;

use App\Http\Resources\SupplierResource;
use App\Models\SupplierGood;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SupplierService extends Service
{
    /*
     * Get All Suppliers
     */
    public function index($request)
    {
        if ($request->filled("idAndName")) {
            $suppliers = User::select("id", "name")
                ->where("account_type", "supplier")
                ->orderBy("id", "DESC")
                ->get();

            return [true, $suppliers->count() . " Suppliers Fetched Successfully", $suppliers];
        }

        $suppliersQuery = User::where("account_type", "supplier");

        $suppliersQuery = $this->search($suppliersQuery, $request);

        $suppliers = $suppliersQuery
            ->paginate(20);

        return [true, $suppliers->count() . " Suppliers Fetched Successfully", $suppliers];
    }

    /*
     * Get One Supplier
     */
    public function show($id)
    {
        $supplier = User::findOrFail($id);

        return [true, $supplier->name . " Fetched Successfully", new SupplierResource($supplier)];
    }

    /*
     * Store Supplier
     */
    public function store($request)
    {
        $supplier = new User;
        $supplier->name = $request->name;
        $supplier->email = $request->email;
        $supplier->password = Hash::make($request->email);
        $supplier->phone = $request->phone;
        $supplier->location = $request->location;
        $supplier->account_type = "supplier";

        $saved = DB::transaction(function () use ($supplier, $request) {
            $saved = $supplier->save();

            // Add Supplier Good
            if ($request->filled("goodIds")) {
                foreach ($request->goodIds as $goodId) {
                    $supplierGood = new SupplierGood;
                    $supplierGood->supplier_id = $supplier->id;
                    $supplierGood->good_id = $goodId;
                    $supplierGood->created_by = $this->id;
                    $supplierGood->save();
                }
            }

            return $saved;
        });

        $message = $supplier->name . " created successfully";

        return [$saved, $message, $supplier];
    }

    /*
     * Update Supplier
     */
    public function update($request, $id)
    {
        $supplier = User::find($id);

        if ($request->filled("name")) {
            $supplier->name = $request->name;
        }

        if ($request->filled("email")) {
            $supplier->email = $request->email;
        }

        if ($request->filled("phone")) {
            $supplier->phone = $request->phone;
        }

        if ($request->filled("location")) {
            $supplier->location = $request->location;
        }

        // Add Supplier Good
        if (count($request->goodIds) > 0) {
            foreach ($request->goodIds as $goodId) {
                // Check if good already exists
                $supplierGoodDoesntExist = SupplierGood::where("good_id", $goodId)
                    ->where("supplier_id", $id)
                    ->doesntExist();

                if ($supplierGoodDoesntExist) {
                    $supplierGood = new SupplierGood;
                    $supplierGood->supplier_id = $id;
                    $supplierGood->good_id = $goodId;
                    $supplierGood->created_by = $this->id;
                    $supplierGood->save();
                } else {
                    // Remove goods not included
                    SupplierGood::where("supplier_id", $id)
                        ->whereNotIn("good_id", $request->goodIds)
                        ->delete();
                }
            }
        } else {
            // Remove goods not included
            SupplierGood::where("user_id", $id)
                ->delete();
        }

        $saved = $supplier->save();

        $message = $supplier->name . " updated successfully";

        return [$saved, $message, $supplier];
    }

    /*
     * Delete Supplier
     */
    public function destroy($id)
    {
        $supplier = User::findOrFail($id);

        $deleted = $supplier->delete();

        $message = $supplier->name . " deleted successfully";

        return [$deleted, $message, $supplier];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        if ($request->filled("name")) {
            $query = $query->where("name", "LIKE", "%" . $request->input("name") . "%");
        }

        if ($request->filled("email")) {
            $query = $query->where("email", "LIKE", "%" . $request->input("email") . "%");
        }

        if ($request->filled("phone")) {
            $query = $query->where("phone", "LIKE", "%" . $request->input("phone") . "%");
        }

        if ($request->filled("gender")) {
            $query = $query->where("gender", $request->input("gender"));
        }

        if ($request->filled("createdBy")) {
            $query = $query->where("created_by", $request->input("createdBy"));
        }

        return $query;
    }
}
