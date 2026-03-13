<?php

namespace App\Http\Services;

use App\Models\Issue;
use App\Models\Project;
use App\Models\Inventory;
use Carbon\Carbon;

class ERPDashboardService extends Service
{

    public function index()
    {
        return [
            "projects" => $this->projects(),
            "inventories" => $this->inventories(),
            "issues" => $this->issues(),
        ];
    }

    /*
     * Projects
     */
    public function projects()
    {
        $chartBox = $this->getChartBoxData(Project::class);

        $getProjectsThisYear = $this->projectsThisYear();

        return [
            "chartBox" => $chartBox,
            "projectsThisYear" => $getProjectsThisYear
        ];
    }

    /*
     * Inventories
     */
    public function inventories()
    {
        $chartBox = $this->getChartBoxData(Inventory::class);

        $getInventoriesThisYear = $this->inventoriesThisYear();

        return [
            "chartBox" => $chartBox,
            "inventoriesThisYear" => $getInventoriesThisYear
        ];
    }

    /*
     * Issues
     */
    public function issues()
    {
        $chartBox = $this->getChartBoxData(Issue::class);

        $getIssuesThisYear = $this->issuesThisYear();

        return [
            "chartBox" => $chartBox,
            "issuesThisYear" => $getIssuesThisYear
        ];
    }

    public function getChartBoxData($model)
    {
        $query = $model::query();

        $total = $query->count();

        // Growth over the last week compared to the week before
        $startOfThisWeek = Carbon::now()->startOfWeek();
        $startOfLastWeek = Carbon::now()->subWeek()->startOfWeek();

        $thisWeekCount = $model::where('created_at', '>=', $startOfThisWeek)->count();
        $lastWeekCount = $model::whereBetween('created_at', [$startOfLastWeek, $startOfThisWeek])->count();

        $growth = $lastWeekCount > 0 ? (($thisWeekCount - $lastWeekCount) / $lastWeekCount) * 100 : 0;

        // Data for last 7 days
        $last7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $count = $model::whereDate('created_at', $date)->count();
            $last7Days[] = $count;
        }

        return [
            "total" => $total,
            "growth" => round($growth, 1),
            "data" => $last7Days,
        ];
    }

    public function projectsThisYear()
    {
        $query = Project::query();

        $getProjectsThisYear = $query
            ->selectRaw("MONTH(created_at) as month, count(*) as count")
            ->whereYear("created_at", Carbon::now()->year)
            ->groupBy("month")
            ->get()
            ->map(fn($item) => [
                "month" => $this->allMonths[$item->month - 1],
                "count" => $item->count,
            ]);

        [$labels, $data] = $this->getLabelsAndData($getProjectsThisYear);

        return [
            "labels" => $labels,
            "data" => $data,
        ];
    }

    public function inventoriesThisYear()
    {
        $query = Inventory::query();

        $getInventoriesThisYear = $query
            ->selectRaw("MONTH(created_at) as month, count(*) as count")
            ->whereYear("created_at", Carbon::now()->year)
            ->groupBy("month")
            ->get()
            ->map(fn($item) => [
                "month" => $this->allMonths[$item->month - 1],
                "count" => $item->count,
            ]);

        [$labels, $data] = $this->getLabelsAndData($getInventoriesThisYear);

        return [
            "labels" => $labels,
            "data" => $data,
        ];
    }

    public function issuesThisYear()
    {
        $query = Issue::query();

        $getIssuesThisYear = $query
            ->selectRaw("MONTH(created_at) as month, count(*) as count")
            ->whereYear("created_at", Carbon::now()->year)
            ->groupBy("month")
            ->get()
            ->map(fn($item) => [
                "month" => $this->allMonths[$item->month - 1],
                "count" => $item->count,
            ]);

        [$labels, $data] = $this->getLabelsAndData($getIssuesThisYear);

        return [
            "labels" => $labels,
            "data" => $data,
        ];
    }
}
