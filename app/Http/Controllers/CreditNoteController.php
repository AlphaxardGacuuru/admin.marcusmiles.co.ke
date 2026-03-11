<?php

namespace App\Http\Controllers;

use App\Models\CreditNote;
use App\Http\Resources\CreditNoteResource;
use App\Http\Services\CreditNoteService;
use Illuminate\Http\Request;

class CreditNoteController extends Controller
{
    public function __construct(protected CreditNoteService $service) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        [$creditNotes, $sum] = $this->service->index($request);

        return CreditNoteResource::collection($creditNotes)
            ->additional([
                "sum" => number_format($sum, 2),
            ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'invoiceId' => 'required|integer|exists:invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'issueDate' => 'required|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        [$saved, $message, $creditNote] = $this->service->store($request);

        return (new CreditNoteResource($creditNote))->additional([
            'saved' => $saved,
            'message' => $message,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $creditNote = $this->service->show($id);

        return new CreditNoteResource($creditNote);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'invoiceId' => 'sometimes|required|integer|exists:invoices,id',
            'amount' => 'sometimes|required|numeric|min:0.01',
            'issueDate' => 'sometimes|required|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        [$updated, $message, $creditNote] = $this->service->update($request, $id);

        return (new CreditNoteResource($creditNote))->additional([
            'updated' => $updated,
            'message' => $message,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        [$deleted, $message, $creditNote] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $creditNote,
        ], 200);
    }
}
