export default function routes(route, resource) {
  resource('comments');
  resource('posts');
  resource('reactions');
  resource('tags');
  resource('users');

  route('actions', {
    method: 'GET',
    action: 'index'
  });

  route('actions/:id', {
    method: 'GET',
    action: 'show'
  });

  route('notifications', {
    method: 'GET',
    action: 'index'
  });

  route('notifications/:id', {
    method: 'GET',
    action: 'show'
  });
}
