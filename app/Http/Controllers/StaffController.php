<?php

namespace App\Http\Controllers;

use App\Http\Resources\StaffResource;
use App\Http\Services\StaffService;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function __construct(protected StaffService $service)
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
        [$status, $message, $staff] = $this->service->index($request);

        return StaffResource::collection($staff)
            ->additional([
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
            "email" => "required|email",
            "phone" => "string",
            "gender" => "required|string",
        ]);

        [$saved, $message, $staff, $code] = $this->service->store($request);

        return (new StaffResource($staff))
            ->additional([
                "status" => $saved,
                "message" => $message,
            ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Staff  $staff
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        [$status, $message, $staff] = $this->service->show($id);

        return (new StaffResource($staff))
            ->additional([
                "status" => $status,
                "message" => $message,
            ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Staff  $staff
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "name" => "nullable|string",
            "email" => "nullable|email|unique:users",
            "phone" => "string|unique:users",
            "gender" => "nullable|string",
        ]);

        [$saved, $message, $staff] = $this->service->update($request, $id);

        return (new StaffResource($staff))
            ->additional([
                "status" => $saved,
                "message" => $message,
            ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Staff  $staff
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $staff] = $this->service->destroy($id);

        return (new StaffResource($staff))
            ->additional([
                "status" => $deleted,
                "message" => $message,
            ]);
    }
}
