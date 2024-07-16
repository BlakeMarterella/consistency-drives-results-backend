import createHttpError from "http-errors";
import type { ResultsCreateRequest, ResultsUpdateRequest } from "../../types/routes/results";
import ErrorMessages from "../common/errorMessages";
import { CommonValidator } from "../common/validator";
import { Repository } from "typeorm";
import { User } from "src/entities/user";
import { Result } from "src/entities/result";

/**
 * Validate the syntax of a result's input fields.
 */
export class BasicValidator {
  /**
   * Check that all the required fields are present in the request body.
   */
  static validateCreateRequest = (body: Partial<ResultsCreateRequest>) => {
    const { name, userId } = body;

    this.validateName(name);
    CommonValidator.validateUUID(userId);

    return body as ResultsCreateRequest;
  };

  /**
   * Check that all the required fields are present in the request body.
   */
  static validateUpdateRequest = (body: Partial<ResultsUpdateRequest>) => {
    const { name } = body;

    if (name) {
      this.validateName(name);
    }

    return body as ResultsUpdateRequest;
  };

  private static validateName(name?: string) {
    if (!name) {
      throw createHttpError(400, ErrorMessages.MISSING_RESULT_NAME);
    }
    if (name.length >= 100) {
      throw createHttpError(400, ErrorMessages.RESULT_NAME_TOO_LONG);
    }
  }
}

/**
 * Validate the semantics of a result's input fields.
 */
export class AdvancedValidator {
  /**
   * Validate that a given id exists in the database.
   *
   * @throws 400 if the id does not exist
   * @returns The user object if it exists
   */
  static findUserById = async (id: string, repo: Repository<User>) => {
    const user = await repo.findOne({
      where: { id },
    });
    if (!user) {
      throw createHttpError(400, ErrorMessages.USER_NOT_FOUND);
    }
    return user;
  };

  /**
   * Validate that a result name is unique.
   */
  static findResultById = async (id: number, repo: Repository<Result>) => {
    const result = await repo.findOne({
        where: { id }
    });
    if (!result) {
        throw createHttpError(400, ErrorMessages.RESULT_NOT_FOUND);
    }
    return result;
  };
}
