using StoreLib.Models;
using StoreLib.Services;

class Program
{
    const string PackageID = "9NBLGGGZM6WM";
    const string PackageSignature = "ROBLOXCORPORATION.ROBLOX_20";

    static async Task Main(string[] args)
    {
        DisplayCatalogHandler dcatHandler = DisplayCatalogHandler.ProductionConfig();
        await dcatHandler.QueryDCATAsync(PackageID);

        bool QueryOnly = args.Length > 0 && args[0] == "-query";

        if (dcatHandler.IsFound)
        {
            var packages = await dcatHandler.GetPackagesForProductAsync();

            foreach (PackageInstance package in packages)
            {
                if (package.PackageMoniker.StartsWith(PackageSignature))
                {
                    if (QueryOnly)
                        Console.WriteLine(package.PackageMoniker.Replace("_~", ""));
                    else
                        await DownloadPackage(package.PackageUri, package.PackageMoniker);
                }
            }
        }
        else
        {
            Console.WriteLine("Product not found.");
            Environment.Exit(1);
        }
    }

    static async Task DownloadPackage(Uri uri, string name)
    {
        using (var httpClient = new HttpClient())
        {
            var response = await httpClient.GetAsync(uri);
            response.EnsureSuccessStatusCode();

            using (var fileStream = new FileStream($"{name}.msixbundle", System.IO.FileMode.Create, System.IO.FileAccess.Write))
            {
                await response.Content.CopyToAsync(fileStream);
            }
        }

        Console.WriteLine($"Downloaded MSIX Bundle: {name}");
    }
}
