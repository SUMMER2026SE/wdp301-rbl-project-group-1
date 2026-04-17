import { baseApi as api } from "../../shared/store/baseApi";

api.enhanceEndpoints({
  endpoints: {
    getMe: {
      providesTags: ["User"],
    },
  },
});
