<?php

namespace App\Http\Controllers;

use App\Models\HarmfulContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class HarmfulContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $harmfulContents = HarmfulContent::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/HarmfulContent/Index', [
            'harmfulContents' => $harmfulContents,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/HarmfulContent/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content_json' => 'required',
            'content_html' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Handle content_json - it might come as a string from FormData
        $contentJson = $request->content_json;
        if (is_string($contentJson)) {
            $contentJson = json_decode($contentJson, true);
        }

        $data = [
            'title' => $request->title,
            'content_json' => $contentJson,
            'content_html' => $request->content_html,
            'category' => $request->category,
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['image_url'] = Storage::url($path);
        }

        $harmfulContent = HarmfulContent::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Harmful content created successfully',
            'data' => $harmfulContent,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $harmfulContent = HarmfulContent::findOrFail($id);

        return Inertia::render('Admin/HarmfulContent/Show', [
            'harmfulContent' => $harmfulContent,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $harmfulContent = HarmfulContent::findOrFail($id);

        return Inertia::render('Admin/HarmfulContent/Edit', [
            'harmfulContent' => $harmfulContent,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $harmfulContent = HarmfulContent::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content_json' => 'required',
            'content_html' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Handle content_json - it might come as a string from FormData
        $contentJson = $request->content_json;
        if (is_string($contentJson)) {
            $contentJson = json_decode($contentJson, true);
        }

        // Add to version history before updating
        $harmfulContent->addVersion($contentJson, $request->content_html);

        $data = [
            'title' => $request->title,
            'content_json' => $contentJson,
            'content_html' => $request->content_html,
            'category' => $request->category,
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['image_url'] = Storage::url($path);
        }

        $harmfulContent->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Harmful content updated successfully',
            'data' => $harmfulContent,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $harmfulContent = HarmfulContent::findOrFail($id);
        $harmfulContent->delete();

        return response()->json([
            'success' => true,
            'message' => 'Harmful content deleted successfully',
        ]);
    }

    /**
     * Upload image for the editor
     */
    public function uploadImage(Request $request)
    {
        Log::info('Upload image request received', ['files' => $request->allFiles()]);

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            Log::error('Image upload validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('image');
        $filename = time() . '_' . $file->getClientOriginalName();

        // Store in public/uploads directory
        $path = $file->storeAs('uploads', $filename, 'public');

        Log::info('Image uploaded successfully', ['path' => $path, 'url' => Storage::url($path)]);

        return response()->json([
            'success' => true,
            'url' => Storage::url($path),
            'filename' => $filename,
        ]);
    }

    /**
     * Get harmful content for customer view
     */
    public function customerView()
    {
        $harmfulContents = HarmfulContent::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('certifications/harmful-ingredients-section', [
            'harmfulContents' => $harmfulContents,
        ]);
    }

    /**
     * Toggle active status
     */
    public function toggleStatus(HarmfulContent $harmfulContent)
    {
        Log::info('Toggle status called', [
            'id' => $harmfulContent->id,
            'current_status' => $harmfulContent->is_active,
            'new_status' => !$harmfulContent->is_active
        ]);

        $harmfulContent->update([
            'is_active' => !$harmfulContent->is_active,
        ]);

        Log::info('Status updated', [
            'id' => $harmfulContent->id,
            'new_status' => $harmfulContent->fresh()->is_active
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $harmfulContent->fresh(),
        ]);
    }
}
