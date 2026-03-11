<?php

namespace App\Http\Services;

use App\Http\Resources\StaffResource;
use App\Http\Services\Service;
use App\Models\User;
use App\Models\UserProperty;
use App\Models\UserRole;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StaffService extends Service
{
    /*
     * Get All Staff
     */
    public function index($request)
    {
        if ($request->filled("idAndName")) {
            $staff = User::select("id", "name")
                ->where("account_type", "staff")
                ->orderBy("id", "DESC")
                ->get();

            return [true, $staff->count() . " Staff Fetched Successfully", $staff];
        }

        $staffQuery = User::where("account_type", "staff");

        $staffQuery = $this->search($staffQuery, $request);

        $staff = $staffQuery
            ->orderBy("id", "DESC")
            ->paginate(20);

        return [true, $staff->count() . "Staff Retrieved Successfully", $staff];
    }

    /*
     * Get One Staff
     */
    public function show($id)
    {
        $staff = User::findOrFail($id);

        return [true, $staff->name . " Retrieved Successfully", $staff];
    }

    /*
     * Store
     */
    public function store($request)
    {
        $staff = new User;
        $staff->name = $request->input("name");
        $staff->email = $request->input("email");
        $staff->phone = $request->input("phone");
        $staff->gender = $request->input("gender");
        $staff->password = Hash::make($request->input("email"));
        $staff->account_type = "staff";

        $saved = DB::transaction(function () use ($request, $staff) {
            $saved = $staff->save();

            $staff->syncRoles($request->userRoles);

            return $saved;
        });

        return [$saved, $staff->name . " Added Successfully", $staff, 200];
    }

    /*
     * Update Staff
     */
    public function update($request, $id)
    {
        $staff = User::findOrFail($id);

        if ($request->filled("name")) {
            $staff->name = $request->input("name");
        }

        if ($request->filled("email")) {
            $staff->email = $request->input("email");
        }

        if ($request->filled("phone")) {
            $staff->phone = $request->input("phone");
        }

        if ($request->filled("gender")) {
            $staff->gender = $request->input("gender");
        }

        if ($request->filled("password")) {
            $staff->password = Hash::make($request->input("password"));
        }

        if ($request->filled("userRoles")) {
            $staff->syncRoles($request->userRoles);
        }

        $saved = $staff->save();

        $message = $staff->name . " Updated Successfully";

        return [$saved, $message, $staff];
    }

    /*
     * Soft Delete Service
     */
    public function destroy($id)
    {
        $staff = User::findOrFail($id);

        $deleted = $staff->delete();

        return [$deleted, $staff->name . " Deleted Successfully", $staff];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        if ($request->filled("name")) {
            $query = $query
                ->where("name", "LIKE", "%" . $request->name . "%");
        }

        if ($request->filled("email")) {
            $query = $query
                ->where("email", "LIKE", "%" . $request->email . "%");
        }

        if ($request->filled("phone")) {
            $query = $query
                ->where("phone", "LIKE", "%" . $request->phone . "%");
        }

        if ($request->filled("gender")) {
            $query = $query->where("gender", $request->gender);
        }

        if ($request->filled("role")) {
            $query = $query->whereHas("roles", function ($q) use ($request) {
                $q->where("name", "LIKE", "%" . $request->role . "%");
            });
        }

        return $query;
    }
}
