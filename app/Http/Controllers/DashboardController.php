<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Services\DashboardService;
use App\Http\Services\ERPDashboardService;
use App\Http\Services\CRMDashboardService;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $service)
    {
        //
    }

    /*
     * Get Dashboard Data
     */
    public function index($propertyIds)
    {
        $propertyIds = explode(",", $propertyIds);

        $data = $this->service->index($propertyIds);

        return response(["data" => $data], 200);
    }

    public function erpDashboard()
    {
        $data = (new ERPDashboardService)->index();

        return response(["data" => $data], 200);
    }

    public function crmDashboard()
    {
        $data = (new CRMDashboardService)->index();

        return response(["data" => $data], 200);
    }
}
