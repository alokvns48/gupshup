import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidaion } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidaion,
});

export async function GET(request: Request) {

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    // put value in object for zod validation
    const queryParam = {
      username: searchParams.get("username"),
    };
    //Validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("result", result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username: username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Failed to check username",
      },
      {
        status: 500,
      }
    );
  }
}
