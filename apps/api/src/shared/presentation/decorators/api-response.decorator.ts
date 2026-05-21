import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
} from '@nestjs/swagger';

interface WrappedResponseOptions {
  description?: string;
  isArray?: boolean;
  nullableData?: boolean;
}

function buildWrappedSchema(
  model?: Type<unknown>,
  options?: WrappedResponseOptions,
) {
  const ref = model
    ? { $ref: `#/components/schemas/${model.name}` }
    : undefined;

  let dataSchema: Record<string, unknown>;

  if (ref) {
    if (options?.isArray) {
      dataSchema = {
        type: 'array',
        items: ref,
        ...(options?.nullableData && { nullable: true }),
      };
    } else if (options?.nullableData) {
      dataSchema = {
        nullable: true,
        allOf: [ref],
      };
    } else {
      dataSchema = ref;
    }
  } else {
    dataSchema = {
      nullable: true,
      oneOf: [
        { type: 'null' },
        { type: 'object', additionalProperties: false },
      ],
    };
  }

  return {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'Success',
      },
      data: dataSchema,
    },
    required: ['success', 'message', ...(model ? ['data'] : [])],
  };
}

function buildQueryWrappedSchema(model?: Type<unknown>) {
  const ref = model
    ? { $ref: `#/components/schemas/${model.name}` }
    : undefined;

  return {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'Success',
      },
      data: {
        type: 'array',
        items: ref ?? { type: 'object', additionalProperties: true },
      },
      meta: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 0 },
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 10 },
          totalPages: { type: 'number', example: 1 },
        },
        required: ['total', 'page', 'limit', 'totalPages'],
      },
    },
    required: ['success', 'message', 'data', 'meta'],
  };
}

export const ApiOkResponseWrapped = <TModel extends Type<any>>(
  model: TModel,
  options?: WrappedResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: options?.description,
      schema: buildWrappedSchema(model, options),
    }),
  );

export const ApiCreatedResponseWrapped = <TModel extends Type<any>>(
  model: TModel,
  options?: WrappedResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiCreatedResponse({
      description: options?.description,
      schema: buildWrappedSchema(model, options),
    }),
  );

export const ApiOkResponseWrappedNoData = (options?: WrappedResponseOptions) =>
  applyDecorators(
    ApiOkResponse({
      description: options?.description,
      schema: buildWrappedSchema(undefined, options),
    }),
  );

export const ApiOkResponseQueryWrapped = <TModel extends Type<any>>(
  model: TModel,
  options?: { description?: string },
) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: options?.description,
      schema: buildQueryWrappedSchema(model),
    }),
  );
