<?php

namespace App\Http\Services;

use App\Http\Resources\ServiceProviderResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ServiceProviderService extends Service
{
    /*
     * Get All ServiceProviders
     */
    public function index($request)
    {
        if ($request->filled("idAndName")) {
            $serviceProviders = User::select("id", "name")
                ->where("account_type", "service provider")
                ->orderBy("id", "DESC")
                ->get();

            return [true, $serviceProviders->count() . " Service Providers Fetched Successfully", $serviceProviders];
        }

        $serviceProvidersQuery = User::where("account_type", "service provider");

        $serviceProvidersQuery = $this->search($serviceProvidersQuery, $request);

        $serviceProviders = $serviceProvidersQuery
            ->paginate(20);

        return [true, $serviceProviders->count() . " Service Providers Retrieved Successfully", $serviceProviders];
    }

    /*
     * Get One ServiceProvider
     */
    public function show($id)
    {
        $serviceProvider = User::findOrFail($id);

        return [true, $serviceProvider->name . " Retrieved Successfully", $serviceProvider];
    }

    /*
     * Store ServiceProvider
     */
    public function store($request)
    {
        $serviceProvider = new User;
        $serviceProvider->name = $request->name;
        $serviceProvider->email = $request->email;
        $serviceProvider->password = Hash::make($request->email);
        $serviceProvider->phone = $request->phone;
        $serviceProvider->id_number = $request->idNumber;
        $serviceProvider->account_type = "service provider";
        $saved = $serviceProvider->save();

        $message = $serviceProvider->name . " created successfully";

        return [$saved, $message, $serviceProvider];
    }

    /*
     * Update ServiceProvider
     */
    public function update($request, $id)
    {
        $serviceProvider = User::find($id);

        if ($request->filled("name")) {
            $serviceProvider->name = $request->name;
        }

        if ($request->filled("email")) {
            $serviceProvider->email = $request->email;
        }

        if ($request->filled("phone")) {
            $serviceProvider->phone = $request->phone;
        }

        if ($request->filled("idNumber")) {
            $serviceProvider->id_number = $request->idNumber;
        }

        $saved = $serviceProvider->save();

        $message = $serviceProvider->name . " updated successfully";

        return [$saved, $message, $serviceProvider];
    }

    /*
     * Delete ServiceProvider
     */
    public function destroy($id)
    {
        $serviceProvider = User::findOrFail($id);

        $deleted = $serviceProvider->delete();

        $message = $serviceProvider->name . " deleted successfully";

        return [$deleted, $message, $serviceProvider];
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

        if ($request->filled("idNumber")) {
            $query = $query->where("id_number", "LIKE", "%" . $request->input("idNumber") . "%");
        }

        if ($request->filled("createdBy")) {
            $query = $query->where("created_by", $request->createdBy);
        }

        return $query;
    }
}
