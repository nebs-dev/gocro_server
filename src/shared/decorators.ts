import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsHigherThan(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isHigherThan",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          console.log("WTF");
          return (
            typeof value === "number" &&
            typeof relatedValue === "number" &&
            value > relatedValue
          ); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
