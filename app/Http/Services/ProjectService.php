<?php

namespace App\Http\Services;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\ProjectStage;
use App\Models\Stage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;

class ProjectService extends Service
{
    /*
     * Get All Projects
     */
    public function index($request)
    {
        if ($request->filled("idAndName")) {
            $projects = Project::select("id", "name")
                ->orderBy("id", "DESC")
                ->get();

            return [true, $projects->count() . " Retrieved Successfully", $projects];
        }

        $query = Project::query();

        $query = $this->search($query, $request);

        $projects = $query
            ->orderBy("id", "DESC")
            ->paginate(20);

        return [true, $projects->count() . "Projects Retrieved Successfully", $projects];
    }

    /*
     * Get One Project
     */
    public function show($id)
    {
        $project = Project::findOrFail($id);

        return new ProjectResource($project);
    }

    /*
     * Store Project
     */
    public function store($request)
    {
        $project = new Project;
        $project->code = $this->generateUniqueCode(Project::class);
        $project->name = $request->name;
        $project->type = $request->type;
        $project->description = $request->description;
        $project->location = $request->location;
        $project->client_id = $request->clientId;
        $project->created_by = $this->id;

        $message = $project->name . " Created Successfully";

        [$saved, $message] = DB::transaction(function () use ($project, $request, $message) {
            $project->save();

            // Create initial project stage
            $firstStage = Stage::where("type", "project")
                ->orderBy('position', 'asc')
                ->first();

            $projectStage = new ProjectStage;
            $projectStage->stage_id = $firstStage->id;
            $projectStage->project_id = $project->id;
            $projectStage->created_by = $this->id;
            $saved = $projectStage->save();

            if ($request->createFolder) {
                $folderId = $this->createGoogleDriveFolder($project);

                $project->drive_folder_id = $folderId;
                $project->save();

                $message .= " and Google Drive Folder Created Successfully";
            }

            return [$saved, $message];
        });

        return [$saved, $message, $project];
    }

    /*
     * Update Project
     */
    public function update($request, $id)
    {
        $project = Project::find($id);

        $message = $project->name . " Updated Successfully";

        if ($request->filled("name")) {
            $project->name = $request->name;
        }

        if ($request->filled("type")) {
            $project->type = $request->type;
        }

        if ($request->filled("description")) {
            $project->description = $request->description;
        }

        if ($request->filled("location")) {
            $project->location = $request->location;
        }

        if ($request->filled("stageId")) {
            $projectStage = new ProjectStage;
            $projectStage->stage_id = $request->stageId;
            $projectStage->project_id = $id;
            $projectStage->created_by = $this->id;
            $projectStage->save();
        }

        if ($request->createFolder) {
            $folderId = $this->createGoogleDriveFolder($project);

            $project->drive_folder_id = $folderId;

            $message .= " and Google Drive Folder Created Successfully";
        }

        $saved = $project->save();

        return [$saved, $message, $project];
    }

    /*
     * Delete Project
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        $deleted = $project->delete();

        $message = $project->name . " Deleted Successfully";

        return [$deleted, $message, $project];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        if ($request->filled("code")) {
            $query = $query->where("code", "LIKE", "%" . $request->code . "%");
        }

        if ($request->filled("name")) {
            $query->where("name", "LIKE", "%" . $request->name . "%");
        }

        if ($request->filled("type")) {
            $query->where("type", $request->type);
        }

        if ($request->filled("location")) {
            $query->where("location", "LIKE", "%" . $request->location . "%");
        }

        $clientId = $request->clientId;

        if ($request->filled("clientId")) {
            $query->whereHas("client", function ($query) use ($clientId) {
                $query->where("id", $clientId);
            });
        }

        if ($request->filled("createdBy")) {
            $query->where("created_by", $request->createdBy);
        }

        if ($request->filled("stageId")) {
            $query->whereHas("latestProjectStage", function ($query) use ($request) {
                $query->where("stage_id", $request->stageId);
            });
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

        $serviceProviderId = $request->serviceProviderId;

        if ($request->filled("serviceProviderId")) {
            $query->whereHas("serviceProviders", function ($query) use ($serviceProviderId) {
                $query->where("service_provider_id", $serviceProviderId);
            });
        }

        return $query;
    }

    /**
     * Create Google Drive folder for the given project
     */
    protected function createGoogleDriveFolder(Project $project)
    {
        try {
            // This creates a folder inside your master folder on google drive
            $disk = Storage::disk('google');

            $disk->makeDirectory($project->code);

            $metadata = $disk->getAdapter()->getMetadata($project->code);

            $folderId = $metadata->extraMetadata()['id'] ?? null;

            return $folderId;
        } catch (Exception $e) {
            Log::error('Failed to create Google Drive folder for project ' . $project->name . ': ' . $e->getMessage());
            throw $e;
        }
    }
}
