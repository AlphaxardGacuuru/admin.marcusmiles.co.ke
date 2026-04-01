<?php

namespace App\Http\Controllers;

use App\Http\Services\WageSheetService;
use App\Models\WageSheet;
use Illuminate\Http\Request;

class WageSheetController extends Controller
{
    public function __construct(protected WageSheetService $service)
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
        return $this->service->index($request);
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
            "projectId" => "required|integer",
            "projectServiceProviderIds" => "required|array",
            "paidBy" => "required|integer",
            "approvedBy" => "required|integer",
            "startsAt" => "required|date",
            "endsAt" => "required|date",
        ]);

        [$saved, $message, $wageSheet] = $this->service->store($request);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $wageSheet,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\WageSheet  $wageSheet
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
     * @param  \App\Models\WageSheet  $wageSheet
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "projectServiceProviderIds" => "nullable|array",
            "paidBy" => "nullable|integer",
            "approvedBy" => "nullable|integer",
            "startsAt" => "nullable|date",
            "endsAt" => "nullable|date",
        ]);

        [$saved, $message, $wageSheet] = $this->service->update($request, $id);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $wageSheet,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\WageSheet  $wageSheet
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $wageSheet] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $wageSheet,
        ], 200);
    }

    public function previewPdf($id)
    {
        [$pdf, $wageSheet] = $this->service->generatePdf($id);

        return $pdf->stream("WageSheet-{$wageSheet->code}.pdf");
    }
}
