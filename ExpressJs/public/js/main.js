$(document).ready( () => {

	$('.deleteUser').on('click', deleteUser);
	$('.updateUser').on('click', updateUser);

});

function deleteUser() {
	let confirmation = confirm('Are you sure?');

	if (confirmation) {
		$.ajax({
			type:'DELETE',
			url: '/users/delete/' + $(this).data('id')
		});
		window.location.replace('/');
	}else{
		return false;
	}
}

function updateUser() {
	const id = $(this).data('id')
	const first_name = $('input[name=first_name]').val();
	const last_name = $('input[name=last_name]').val();
	const email = $('input[name=email]').val();
	
	$.ajax({
		type:'GET',
		url: '/users/update/' + id + '/' + first_name + '/' + last_name + '/' + email 
	});

	window.location.replace('/');
}