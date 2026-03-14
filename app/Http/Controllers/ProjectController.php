<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Services\ProjectService;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function __construct(protected ProjectService $service)
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
        [$status, $message, $projects] = $this->service->index($request);

        return ProjectResource::collection($projects)
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
            "type" => "required|string",
            "description" => "nullable|string|max:255",
            "location" => "required|string",
            "clientId" => "required|string",
        ]);

        [$saved, $message, $project] = $this->service->store($request);
        
        try {
            // This creates a folder inside your master folder on google drive
            Storage::disk('google')->makeDirectory($project->code);
        } catch (\Exception $e) {
            Log::error('Failed to create Google Drive folder for project ' . $project->name . ': ' . $e->getMessage());
        }

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $project,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->service->show($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "name" => "nullable|string",
            "type" => "nullable|string",
            "description" => "nullable|string|max:255",
            "location" => "nullable|string",
            "clientId" => "nullable|string",
        ]);

        [$saved, $message, $project] = $this->service->update($request, $id);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $project,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $project] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $project,
        ], 200);
    }
}
