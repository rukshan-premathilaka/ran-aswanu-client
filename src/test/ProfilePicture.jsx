const API_BASE_URL = "http://localhost:8080";

function ProfileAvatar({ profilePictureUrl }) {
	const imageUrl = profilePictureUrl
		? `${API_BASE_URL}${profilePictureUrl}`
		: "/default-avatar.png"; // fallback for users with no picture yet

	return (
		<img
			src={imageUrl}
			alt="Profile"
			className="w-24 h-24 rounded-full object-cover border border-lime-200"
		/>
	);
}

export default ProfileAvatar;