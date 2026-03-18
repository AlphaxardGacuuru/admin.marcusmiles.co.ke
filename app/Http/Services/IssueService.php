<?php

namespace App\Http\Services;

use App\Http\Resources\IssueResource;
use App\Models\Issue;
use App\Models\IssueStage;
use App\Models\Project;
use App\Models\Stage;
use Illuminate\Support\Facades\DB;

class IssueService extends Service
{
    /*
     * Get All Issues
     */
    public function index($request)
    {
        $issuesQuery = new Issue;

        $issuesQuery = $this->search($issuesQuery, $request);

        $issues = $issuesQuery
            ->paginate(20);

        return IssueResource::collection($issues);
    }

    /*
     * Get One Issue
     */
    public function show($id)
    {
        $issue = Issue::findOrFail($id);

        return new IssueResource($issue);
    }

    /*
     * Store Issue
     */
    public function store($request)
    {
		$project = Project::find($request->projectId);
        $issueNumber = Issue::where("project_id", $project->id)->count() + 1;
        $paddedIssueNumber = str_pad($issueNumber, 3, '0', STR_PAD_LEFT);

		$code = "I-" . $project->code . $paddedIssueNumber;

        $issue = new Issue;
        $issue->code = $code;
        $issue->title = $request->title;
        $issue->description = $request->description;
        $issue->assigned_to = $request->assignedTo;
        $issue->planned_start_date = $request->plannedStartDate;
        $issue->planned_end_date = $request->plannedEndDate;
        $issue->priority = $request->priority;
        $issue->project_id = $request->projectId;
        $issue->created_by = $this->id;

        $saved = DB::transaction(function () use ($issue) {
            $issue->save();

			$firstStage = Stage::where("type", "issue")
                ->orderBy('position', 'asc')
                ->first();

            $issueStage = new IssueStage;
            $issueStage->stage_id = $firstStage->id;
            $issueStage->issue_id = $issue->id;
            $issueStage->created_by = $this->id;
            return $issueStage->save();
        });

        $message = "Issue " . $issue->code . " created successfully";

        return [$saved, $message, $issue];
    }

    /*
     * Update Issue
     */
    public function update($request, $id)
    {
        $issue = Issue::find($id);

        if ($request->filled("code")) {
            $issue->code = $request->code;
        }

        if ($request->filled("title")) {
            $issue->title = $request->title;
        }

        if ($request->filled("description")) {
            $issue->description = $request->description;
        }

        if ($request->filled("assignedTo")) {
            $issue->assigned_to = $request->assignedTo;
        }

        if ($request->filled("plannedStartDate")) {
            $issue->planned_start_date = $request->plannedStartDate;
        }

        if ($request->filled("plannedEndDate")) {
            $issue->planned_end_date = $request->plannedEndDate;
        }

        if ($request->filled("priority")) {
            $issue->priority = $request->priority;
        }

        if ($request->filled("projectId")) {
            $issue->project_id = $request->projectId;
        }

        if ($request->filled("stageId")) {
            $issueStage = new IssueStage;
            $issueStage->stage_id = $request->stageId;
            $issueStage->issue_id = $id;
            $issueStage->created_by = $this->id;
            $issueStage->save();
        }

        $saved = $issue->save();

        $message = "Issue " . $issue->code . " updated successfully";

        return [$saved, $message, $issue];
    }

    /*
     * Delete Issue
     */
    public function destroy($id)
    {
        $issue = Issue::findOrFail($id);

        $deleted = $issue->delete();

        $message = $issue->code . " deleted successfully";

        return [$deleted, $message, $issue];
    }

    /*
     * Reorder Issues
     */
    public function reorder($request)
    {
        DB::transaction(function () use ($request) {
            foreach ($request->idsAndPositions as $idAndPosition) {
                $issue = Issue::find($idAndPosition["id"]);
                $issue->position = $idAndPosition["position"];
                $issue->created_by = $this->id;
                $issue->save();
            }
        });

        return ["Saved", "Issue updated", ""];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        if ($request->filled("name")) {
            $query = $query->where("name", "LIKE", "%" . $request->name . "%");
        }

        if ($request->filled("createdBy")) {
            $query = $query->where("created_by", $request->createdBy);
        }

        return $query;
    }
}
