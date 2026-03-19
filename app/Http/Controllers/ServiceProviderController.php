<?php

namespace App\Http\Controllers;

use App\Http\Resources\ServiceProviderResource;
use App\Http\Services\Service;
use App\Http\Services\ServiceProviderService;
use App\Models\User;
use Illuminate\Http\Request;

class ServiceProviderController extends Controller
{
    public function __construct(protected ServiceProviderService $service)
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
        [$status, $message, $serviceProviders] = $this->service->index($request);

        return ServiceProviderResource::collection($serviceProviders)->additional([
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
            "email" => "nullable|string",
            "phone" => "required|string",
            "location" => "nullable|string",
        ]);

        [$saved, $message, $serviceProvider] = $this->service->store($request);

        return (new ServiceProviderResource($serviceProvider))->additional([
            "status" => $saved,
            "message" => $message,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $serviceProvider
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        [$status, $message, $serviceProvider] = $this->service->show($id);

        return (new ServiceProviderResource($serviceProvider))->additional([
            "status" => $status,
            "message" => $message,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $serviceProvider
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

        [$saved, $message, $serviceProvider] = $this->service->update($request, $id);

        return (new ServiceProviderResource($serviceProvider))->additional([
            "status" => $saved,
            "message" => $message,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $serviceProvider
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $serviceProvider] = $this->service->destroy($id);

        return (new ServiceProviderResource($serviceProvider))->additional([
            "status" => $deleted,
            "message" => $message,
        ]);
    }
}
