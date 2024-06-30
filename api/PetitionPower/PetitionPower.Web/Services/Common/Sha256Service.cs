﻿using IdentityModel;
using System.Security.Cryptography;
using System.Text;

namespace PetitionPower.Web.Services.Common;

public static class Sha256Service
{
    public static string ComputeHash(string codeVerifier)
    {
        using var sha256 = SHA256.Create();
        var challengeBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(codeVerifier));
        var codeChallenge = Base64Url.Encode(challengeBytes);
        return codeChallenge;
    }
}
