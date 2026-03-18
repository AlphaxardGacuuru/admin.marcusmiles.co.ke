<?php

namespace App\Http\Services;

use App\Http\Resources\ClientResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ClientService extends Service
{
    /*
     * Get All Clients
     */
    public function index($request)
    {
        if ($request->filled("idAndName")) {
            $clients = User::select("id", "name")
                ->where("account_type", "client")
                ->orderBy("id", "DESC")
                ->get();

            return response([
                "data" => $clients,
            ], 200);
        }

        $clientsQuery = User::where("account_type", "client");

        $clientsQuery = $this->search($clientsQuery, $request);

        $clients = $clientsQuery
            ->paginate(20);

        return ClientResource::collection($clients);
    }

    /*
     * Get One Client
     */
    public function show($id)
    {
        $client = User::findOrFail($id);

        return new ClientResource($client);
    }

    /*
     * Store Client
     */
    public function store($request)
    {
        $client = new User;
        $client->name = $request->name;
        $client->email = $request->email;
        $client->password = Hash::make($request->phone ?? $request->email);
        $client->phone = $request->phone;
        $client->location = $request->location;
        $client->account_type = "client";
        $saved = $client->save();

        $message = $client->name . " created successfully";

        return [$saved, $message, $client];
    }

    /*
     * Update Client
     */
    public function update($request, $id)
    {
        $client = User::find($id);

        if ($request->filled("name")) {
            $client->name = $request->name;
        }

        if ($request->filled("email")) {
            $client->email = $request->email;
        }

        if ($request->filled("phone")) {
            $client->phone = $request->phone;
        }

        if ($request->filled("location")) {
            $client->location = $request->location;
        }

        $saved = $client->save();

        $message = $client->name . " updated successfully";

        return [$saved, $message, $client];
    }

    /*
     * Delete Client
     */
    public function destroy($id)
    {
        $client = User::findOrFail($id);

        $deleted = $client->delete();

        $message = $client->name . " deleted successfully";

        return [$deleted, $message, $client];
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

        if ($request->filled("location")) {
            $query = $query->where("location", "LIKE", "%" . $request->input("location") . "%");
        }

        if ($request->filled("createdBy")) {
            $query = $query->where("created_by", $request->createdBy);
        }

        return $query;
    }
}
