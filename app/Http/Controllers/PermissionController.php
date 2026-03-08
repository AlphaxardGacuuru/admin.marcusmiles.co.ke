<?php

namespace App\Http\Controllers;

use App\Http\Services\PermissionService;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
	public function __construct(protected PermissionService $service)
	{
		//
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$permissions = $this->service->index();

		return response()->json([
			"data" => $permissions
		], 200);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		//
	}

	/**
	 * Get all models
	 */
	public function getAllModels()
	{
		$models = $this->service->getAllModels();

		return response()->json([
			'success' => true,
			'data' => $models,
			'total' => count($models)
		]);
	}

	/**
	 * Generate permissions for all models
	 */
	public function generatePermissions()
	{
		try {
			$result = $this->service->generatePermissionsForAllModels();

			return response()->json([
				'success' => true,
				'message' => "Generated {$result['total_permissions']} permissions for " . count($result['models']) . " models",
				'data' => $result
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Failed to generate permissions: ' . $e->getMessage()
			], 500);
		}
	}

	/**
	 * Generate permissions for a specific model
	 */
	public function generateModelPermissions(Request $request, $modelName)
	{
		try {
			$permissions = $this->service->generatePermissionsForModel($modelName);

			return response()->json([
				'success' => true,
				'message' => "Generated " . count($permissions) . " permissions for {$modelName}",
				'data' => $permissions
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Failed to generate permissions: ' . $e->getMessage()
			], 500);
		}
	}

	/**
	 * Sync permissions (add missing, optionally remove orphaned)
	 */
	public function syncPermissions()
	{
		try {
			$result = $this->service->syncPermissions();

			return response()->json([
				'success' => true,
				'message' => "Synced permissions for {$result['models_found']} models. Expected {$result['expected_permissions']} permissions.",
				'data' => $result
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'Failed to sync permissions: ' . $e->getMessage()
			], 500);
		}
	}
}
