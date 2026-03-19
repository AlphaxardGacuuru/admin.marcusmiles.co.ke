<?php

namespace App\Http\Controllers;

use App\Http\Resources\SupplierResource;
use App\Http\Services\SupplierService;
use App\Models\User;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function __construct(protected SupplierService $service)
    {
        //
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        [$status, $message, $suppliers] = $this->service->index($request);

        return SupplierResource::collection($suppliers)->additional([
            "status" => $status,
            "message" => $message,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            "name" => "required|string",
            "email" => "required|string",
            "phone" => "nullable|string",
            "location" => "nullable|string",
        ]);

        [$saved, $message, $supplier] = $this->service->store($request);

        return (new SupplierResource($supplier))->additional([
            "status" => $saved,
            "message" => $message,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $supplier
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        [$status, $message, $supplier] = $this->service->show($id);

        return (new SupplierResource($supplier))->additional([
            "status" => $status,
            "message" => $message,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $supplier
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "name" => "nullable|string",
            "email" => "nullable|string",
            "phone" => "nullable|string",
            "location" => "nullable|string",
        ]);

        [$saved, $message, $supplier] = $this->service->update($request, $id);

        return (new SupplierResource($supplier))->additional([
            "status" => $saved,
            "message" => $message,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $supplier
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $supplier] = $this->service->destroy($id);

        return (new SupplierResource($supplier))->additional([
            "status" => $deleted,
            "message" => $message,
        ]);
    }
}
