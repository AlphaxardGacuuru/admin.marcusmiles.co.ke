<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            "id" => $this->id,
            "code" => $this->code,
            "projectId" => $this->project->id,
            "projectName" => $this->project->name,
            "invoiceId" => $this->invoice->id,
            "invoiceCode" => $this->invoice->code,
            "amount" => number_format($this->amount),
            "paymentDate" => $this->payment_date,
            "paymentDateFormatted" => Carbon::parse($this->payment_date)->format("Y-m-d"),
            "notes" => $this->notes,
            "updatedAt" => $this->updatedAt,
            "createdAt" => $this->createdAt,
        ];
    }
}
