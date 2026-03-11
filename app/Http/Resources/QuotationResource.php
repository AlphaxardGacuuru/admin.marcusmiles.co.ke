<?php

namespace App\Http\Resources;

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
            'expiryDate' => $this->expiry_date,
            'notes' => $this->notes,
            'total' => $this->total,
            'status' => $this->status,
            'items' => $this->quotationItems,
            'createdByName' => $this->createdBy->name,
            'updatedAt' => $this->updated_at,
            'createdAt' => $this->created_at,
        ];
    }
}
