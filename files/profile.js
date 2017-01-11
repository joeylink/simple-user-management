$(function(){
	var muranoToken = null;

	/* render the locks on the screen */
	function render(locks) {
		locks = _.sortBy(locks, ['lockID']);

		var template = $("#lock-template").html();
		var compiledTemplate = _.template(template);
		$('#locks').html(compiledTemplate({locks: locks}));

		// connect button events
		$('.button-lock').click(function() {
			lockCommand($(this).data("id"), 'locked');
		});
		$('.button-unlock').click(function() {
			lockCommand($(this).data("id"), 'unlocked');
		});
	}

	/* sign in by posting to /token to get a token and setting
	 it in muranoToken */
	function signIn() {
		console.log('signing in...');
		$.ajax({
			method: 'POST',
			url: '/api/v1/session',
			data: JSON.stringify({email: $('#email').val(), password: $('#password').val()}),
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				muranoToken = data.token;
				$('#nav-signedin-message').html('Signed in as <b>' + data.name + '</b> ');
				$('.nav-signedout').hide();
				$('.nav-signedin').show();

				getProfileDetails();
			},
			error: function(xhr, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
	}
	function signUp() {
		console.log('signing up...');
		$.ajax({
			method: 'POST',
			url: '/api/v1/user',
			data: JSON.stringify({email: $('#email').val(), password: $('#password').val()}),
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				alert("You should soon receive an email with a validation token.");
			},
			error: function(xhr, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
	}

	/* sign out by setting muranoToken to null */
	function signOut() {
		muranoToken = null;
		$('#email').val('');
		$('#password').val('');
		$('.nav-signedout').show();
		$('.nav-signedin').hide();
	}

	function getProfileDetails() {
		$.ajax({
			method: 'GET',
			url: '/api/v1/user/' + $('#email').val() + '/profile',
			success: function(data) {
				console.log(data);
				var gavHash = md5( data.email.trim() );
				var imgUrl = 'https://www.gravatar.com/avatar/' + gavHash + '?d=mm';
				$('div.avatar img').attr('src', imgUrl);
				$('div.avatar img').attr('alt', "Avatar for " + data.name);

				$('div.real-name').text(data.name);
				$('div.location').text(data.location);
				$('div.bio').text(data.bio);


				$('.profile-details').show();
			},
			error: function(xhr, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
	}


	// set initial state of signin controls
	$('.nav-signedin').hide();
	$('.profile-details').hide();

	$('#sign-in').click(function() {
		signIn();
	});
	$('#sign-out').click(function() {
		signOut();
	});
	$('#sign-up').click(function(){
		signUp();
	});

});
//	vim: set sw=4 ts=4 :
