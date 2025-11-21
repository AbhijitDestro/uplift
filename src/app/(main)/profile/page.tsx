"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Camera, Mail, Lock, User, Briefcase, Building2, Calendar, Tag, Edit2, Save, X } from "lucide-react";

export default function ProfilePage() {
    const [isEditingProfile, setIsEditingProfile] = React.useState(false);
    const [isEditingJobDetails, setIsEditingJobDetails] = React.useState(false);
    const [profileImage, setProfileImage] = React.useState<string | null>(null);

    // Profile form state
    const [profileData, setProfileData] = React.useState({
        name: "John Doe",
        email: "john.doe@example.com",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Job details form state
    const [jobDetails, setJobDetails] = React.useState({
        jobTitle: "Senior Software Engineer",
        company: "Tech Corp",
        yearsOfExperience: "5",
        industries: "Technology, SaaS",
        keySkills: "React, TypeScript, Node.js, AWS",
    });

    const [savedJobDetails, setSavedJobDetails] = React.useState(jobDetails);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        // Here you would typically save to backend
        setIsEditingProfile(false);
    };

    const handleSaveJobDetails = () => {
        setSavedJobDetails(jobDetails);
        setIsEditingJobDetails(false);
    };

    const handleCancelJobDetails = () => {
        setJobDetails(savedJobDetails);
        setIsEditingJobDetails(false);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and job preferences
                </p>
            </motion.div>

            {/* Profile Information Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    {!isEditingProfile && (
                        <button
                            onClick={() => setIsEditingProfile(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Profile Image */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full bg-linear-to-br from-primary to-purple-500 flex items-center justify-center text-primary-foreground font-bold text-2xl overflow-hidden">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    "JD"
                                )}
                            </div>
                            <label
                                htmlFor="profile-image"
                                className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                            >
                                <Camera className="h-4 w-4" />
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{profileData.name}</h3>
                            <p className="text-sm text-muted-foreground">{profileData.email}</p>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    disabled={!isEditingProfile}
                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    disabled={!isEditingProfile}
                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {isEditingProfile && (
                            <>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="password"
                                            value={profileData.currentPassword}
                                            onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                                            placeholder="Enter current password"
                                            className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="password"
                                            value={profileData.newPassword}
                                            onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                                            placeholder="Enter new password"
                                            className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="password"
                                            value={profileData.confirmPassword}
                                            onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                                            placeholder="Confirm new password"
                                            className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {isEditingProfile && (
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsEditingProfile(false)}
                                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Job Details Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-background/40 backdrop-blur-sm border border-border rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Professional Details</h2>
                    {!isEditingJobDetails && (
                        <button
                            onClick={() => setIsEditingJobDetails(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Current Job Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={jobDetails.jobTitle}
                                    onChange={(e) => setJobDetails({ ...jobDetails, jobTitle: e.target.value })}
                                    disabled={!isEditingJobDetails}
                                    placeholder="e.g., Software Engineer"
                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Company Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={jobDetails.company}
                                    onChange={(e) => setJobDetails({ ...jobDetails, company: e.target.value })}
                                    disabled={!isEditingJobDetails}
                                    placeholder="e.g., Google"
                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Years of Experience</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={jobDetails.yearsOfExperience}
                                    onChange={(e) => setJobDetails({ ...jobDetails, yearsOfExperience: e.target.value })}
                                    disabled={!isEditingJobDetails}
                                    placeholder="e.g., 5"
                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Industries</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={jobDetails.industries}
                                    onChange={(e) => setJobDetails({ ...jobDetails, industries: e.target.value })}
                                    disabled={!isEditingJobDetails}
                                    placeholder="e.g., Technology, Finance"
                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Key Skills</label>
                        <textarea
                            value={jobDetails.keySkills}
                            onChange={(e) => setJobDetails({ ...jobDetails, keySkills: e.target.value })}
                            disabled={!isEditingJobDetails}
                            placeholder="e.g., React, TypeScript, Node.js, AWS"
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        />
                    </div>

                    {isEditingJobDetails && (
                        <div className="flex gap-3 justify-end pt-2">
                            <button
                                onClick={handleCancelJobDetails}
                                className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveJobDetails}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <Save className="h-4 w-4" />
                                Save Details
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
