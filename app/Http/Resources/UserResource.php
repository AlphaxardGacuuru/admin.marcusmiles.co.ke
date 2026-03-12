<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            "name" => $this->name,
            "email" => $this->email,
            "phone" => $this->phone,
            "gender" => $this->gender,
            "avatar" => $this->avatar,
            "accountType" => $this->account_type,
            "roles" => $this->roles,
            "roleNames" => $this->getRoleNames(),
            "permissions" => $this->getAllPermissions()
                ->pluck('name')
                ->unique()
                ->values(),
            "createdAt" => $this->created_at,
        ];
    }
}
