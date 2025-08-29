<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    /**
     * Display a listing of the videos.
     */
    public function index(): Response
    {
        $videos = Video::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Videos/Index', [
            'videos' => $videos,
        ]);
    }

    /**
     * Store a newly created video in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'instagram_url' => 'required|url',
            'video_id' => 'required|string|max:255',
            'thumbnail' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Check if trying to activate and already have 3 active videos
        if ($request->boolean('is_active') && Video::where('is_active', true)->count() >= 3) {
            return redirect()->back()->withErrors(['is_active' => 'Maximum of 3 active videos allowed.']);
        }

        $video = Video::create($request->all());

        return redirect()->back()->with('success', 'Video created successfully.');
    }

    /**
     * Update the specified video in storage.
     */
    public function update(Request $request, Video $video)
    {
        $request->validate([
            'instagram_url' => 'required|url',
            'video_id' => 'required|string|max:255',
            'thumbnail' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Check if trying to activate and already have 3 active videos (excluding current video)
        if ($request->boolean('is_active') && !$video->is_active) {
            $activeCount = Video::where('is_active', true)->where('id', '!=', $video->id)->count();
            if ($activeCount >= 3) {
                return redirect()->back()->withErrors(['is_active' => 'Maximum of 3 active videos allowed.']);
            }
        }

        $video->update($request->all());

        return redirect()->back()->with('success', 'Video updated successfully.');
    }

    /**
     * Remove the specified video from storage.
     */
    public function destroy(Video $video)
    {
        $video->delete();

        return redirect()->back()->with('success', 'Video deleted successfully.');
    }

    /**
     * Toggle the active status of a video.
     */
    public function toggleStatus(Video $video)
    {
        // If trying to activate, check if we already have 3 active videos
        if (!$video->is_active) {
            $activeCount = Video::where('is_active', true)->count();
            if ($activeCount >= 3) {
                return redirect()->back()->withErrors(['is_active' => 'Maximum of 3 active videos allowed.']);
            }
        }

        $video->update(['is_active' => !$video->is_active]);

        return redirect()->back()->with('success', 'Video status updated successfully.');
    }
}
