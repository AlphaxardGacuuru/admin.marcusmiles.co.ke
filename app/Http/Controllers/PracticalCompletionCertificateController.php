<?php

namespace App\Http\Controllers;

use App\Http\Services\PracticalCompletionCertificateService;
use App\Models\PracticalCompletionCertificate;
use Illuminate\Http\Request;

class PracticalCompletionCertificateController extends Controller
{
    public function __construct(protected PracticalCompletionCertificateService $service)
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
            "employer" => "required|string",
            "contractor" => "required|string",
            "projectManager" => "required|string",
            "brief" => "required|string",
            "contractDates" => "required|date",
        ]);

        [$saved, $message, $practicalCompletionCertificate] = $this->service->store($request);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $practicalCompletionCertificate,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PracticalCompletionCertificate  $practicalCompletionCertificate
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
     * @param  \App\Models\PracticalCompletionCertificate  $practicalCompletionCertificate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "employer" => "nullable|string",
            "contractor" => "nullable|string",
            "projectManager" => "nullable|string",
            "brief" => "nullable|string",
            "contractDates" => "nullable|date",
        ]);

        [$saved, $message, $practicalCompletionCertificate] = $this->service->update($request, $id);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $practicalCompletionCertificate,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PracticalCompletionCertificate  $practicalCompletionCertificate
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $practicalCompletionCertificate] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $practicalCompletionCertificate,
        ], 200);
    }

    public function previewPdf($id)
    {
        [$pdf, $practicalCompletionCertificate] = $this->service->generatePdf($id);

        return $pdf->stream("PracticalCompletionCertificate-{$practicalCompletionCertificate->code}.pdf");
    }
}
