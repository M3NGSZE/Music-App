const FolderList = () => {
    return(
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-lg font-semibold text-white">
                    Music Folders
                </h2>
                <p className="text-sm text-white/50">
                    Browse and manage your music folders.
                </p>
            </div>

            {/* Folder content will go here */}
        </div>
    )
}

export default FolderList;