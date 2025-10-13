export class BadRequestErr extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UserNotAuthenticatedErr extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UserForbiddenErr extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundErr extends Error {
  constructor(message: string) {
    super(message);
  }
}
