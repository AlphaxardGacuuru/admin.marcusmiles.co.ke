<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class QuotationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'projectId' => $this->project_id,
            'projectName' => $this->project->name,
            'issueDate' => $this->issue_date,
            "issueDateFormatted" => Carbon::parse($this->issue_date)->format("Y-m-d"),
            'expiryDate' => $this->expiry_date,
            "expiryDateFormatted" => Carbon::parse($this->expiry_date)->format("Y-m-d"),
            'notes' => $this->notes,
            'tax' => $this->tax,
            'total' => $this->total,
            'status' => $this->status,
            'items' => $this->quotationItems,
            'createdByName' => $this->createdBy->name,
            'updatedAt' => $this->updated_at,
            'createdAt' => $this->created_at,
        ];
    }
}
