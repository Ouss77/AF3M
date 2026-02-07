export const getUsers = async () => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/getUsers.php`
	);

	if (!response.ok) {
		throw new Error("Failed to fetch users.");
	}

	return response.json();
};

export const deleteUserById = async (id) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/deleteUser.php`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
				_method: "DELETE",
			}),
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result?.message || "Failed to delete the user");
	}

	return result;
};

export const updateUser = async (updatedUser) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/editUser.php`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedUser),
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result?.message || "Failed to update the user");
	}

	return result;
};
